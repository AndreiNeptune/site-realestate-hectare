'use client'

import { useTransition, useState, useEffect, useRef } from 'react'
import { addHectar, updateHectar } from '@/app/admin/hectare/actions'
import { createClient } from '@/lib/supabase/client'
import { Trees, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Land } from '@/lib/types'

interface HectarFormProps {
  initialData?: Land
}

// Helper to resize and convert image to WebP
async function processImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600; // Standard professional web resolution

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert canvas to blob'));
              return;
            }
            // Create a new File with .webp extension
            const originalName = file.name.split('.').slice(0, -1).join('.');
            const newFile = new File([blob], `${originalName || 'image'}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          'image/webp',
          0.85 // 85% quality is the sweet spot for WebP
        );
      };
      img.onerror = () => reject(new Error('Eroare la procesarea imaginii.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Eroare la citirea fișierului.'));
    reader.readAsDataURL(file);
  });
}

// Helper to slugify title for SEO-friendly filenames
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/\s+/g, '-')            // Replace spaces with -
    .replace(/[^\w-]+/g, '')         // Remove all non-word chars
    .replace(/--+/g, '-')            // Replace multiple - with single -
    .slice(0, 50);                   // Limit length
}

export function HectarForm({ initialData }: HectarFormProps) {
  const [isPending, startTransition] = useTransition()
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.imagini || [])

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // New state for selected files and previews
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 20 images at once for safety
    if (selectedFiles.length + files.length > 20) {
      setErrorMessage('Puteți selecta maxim 20 de imagini.')
      return
    }

    const newFiles = [...selectedFiles, ...files]
    setSelectedFiles(newFiles)

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
    
    // Reset input value so same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeSelectedImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    const formData = new FormData(e.currentTarget)
    const target = e.target as HTMLFormElement;
    
    // Get title for SEO-friendly naming
    const titlu = formData.get('titlu') as string;
    const titleSlug = slugify(titlu || 'hectar');
    
    startTransition(async () => {
      try {
        const newImageUrls: string[] = []
        
        // Remove imagini from formData to prevent sending large payload to Server Action
        formData.delete('imagini')

        const supabase = createClient()
        let objectUploadError = null;

        // Upload images from state instead of FormData
        let imageIndex = 1;
        for (const file of selectedFiles) {
          if (file && file.size > 0 && file.name) {
             // 1. Process/Resize/Convert image to WebP
             let processedFile = file;
             try {
               processedFile = await processImage(file);
             } catch (err) {
               console.warn("Failed to process image, uploading original:", err);
             }

             const fileExt = processedFile.name.split('.').pop()
             const fileName = `${titleSlug}-${imageIndex}.${fileExt}`
             const filePath = `hectare/${Date.now()}-${fileName}`
             
             const { error: uploadError } = await supabase.storage.from('land-images').upload(filePath, processedFile)
             
             if (!uploadError) {
                const { data } = supabase.storage.from('land-images').getPublicUrl(filePath)
                newImageUrls.push(data.publicUrl)
                imageIndex++;
             } else {
                objectUploadError = uploadError.message;
             }
          }
        }

        if (objectUploadError) {
          setErrorMessage(`Eroare la încărcarea imaginilor: ${objectUploadError}`)
          return
        }

        // Add imageUrls as JSON string to formData
        if (newImageUrls.length > 0) {
          formData.append('imageUrls', JSON.stringify(newImageUrls))
        }

        // Add remaining existing images
        if (initialData) {
          formData.append('existingImageUrls', JSON.stringify(existingImages))
        }

        let result;
        if (initialData) {
          result = await updateHectar(initialData.id, formData)
        } else {
          result = await addHectar(formData)
        }

        if (result && !result.success) {
          setErrorMessage(result.error || 'A apărut o eroare la salvarea hectarului.')
        } else if (result && result.success) {
          setSuccessMessage(initialData ? 'Hectarul a fost actualizat cu succes!' : 'Hectarul a fost adăugat cu succes!')
          if (!initialData) {
            target.reset()
            setExistingImages([])
            setSelectedFiles([])
            setPreviews([])
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'A apărut o eroare neașteptată.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titlu */}
        <div className="col-span-full space-y-2">
          <label className="text-sm font-medium text-gray-700">Titlu Anunț <span className="text-red-500">*</span></label>
          <input 
            required 
            name="titlu" 
            type="text" 
            defaultValue={initialData?.titlu}
            placeholder="Ex: Hectar intravilan 1000mp cu utilități..." 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" 
          />
        </div>

        {/* Preț */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Preț / mp (Euro) <span className="text-red-500">*</span></label>
          <input 
            required 
            name="pret" 
            type="number" 
            step="0.01" 
            min="0" 
            defaultValue={initialData?.pret}
            placeholder="Ex: 30" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" 
          />
        </div>

        {/* Suprafață */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Suprafață (mp) <span className="text-red-500">*</span></label>
          <input 
            required 
            name="suprafata" 
            type="number" 
            step="0.01" 
            min="1" 
            defaultValue={initialData?.suprafata_mp}
            placeholder="Ex: 1000" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" 
          />
        </div>

        {/* Județ */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Județ <span className="text-red-500">*</span></label>
          <input 
            required 
            name="judet" 
            type="text" 
            defaultValue={initialData?.judet}
            placeholder="Ex: Ilfov" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" 
          />
        </div>

        {/* Localitate */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Localitate <span className="text-red-500">*</span></label>
          <input 
            required 
            name="localitate" 
            type="text" 
            defaultValue={initialData?.localitate}
            placeholder="Ex: Otopeni" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" 
          />
        </div>

        <div className="space-y-2">
           <label className="text-sm font-medium text-gray-700">Tip Teren <span className="text-red-500">*</span></label>
           <select 
            name="tip_hectar" 
            defaultValue={initialData?.tip_hectar || 'rezidential'}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
           >
              <option value="rezidential">Rezidențial</option>
              <option value="industrial">Industrial</option>
              <option value="agricol">Agricol</option>
              <option value="pasune">Pășune</option>
              <option value="ferma">Fermă</option>
              <option value="padure">Pădure</option>
           </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
           <label className="text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
           <select 
            name="status" 
            defaultValue={initialData?.status || 'disponibil'}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
           >
              <option value="disponibil">Disponibil</option>
              <option value="rezervat">Rezervat</option>
              <option value="vandut">Vândut</option>
           </select>
        </div>



        {/* Descriere */}
        <div className="col-span-full space-y-2">
          <label className="text-sm font-medium text-gray-700">Descriere</label>
          <textarea 
            name="descriere" 
            rows={5} 
            defaultValue={initialData?.descriere || ''}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" 
            placeholder="Descrieți hectarul..."
          ></textarea>
        </div>

        {/* Utilități */}
        <div className="col-span-full space-y-4">
          <label className="text-sm font-medium text-gray-700 block border-b border-gray-100 pb-2">Utilități Disponibile</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-white hover:border-blue-600 transition-all select-none group shadow-sm">
              <input 
                type="checkbox" 
                name="has_curent" 
                defaultChecked={initialData?.has_curent}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 transition-all" 
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Curent electric</span>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-white hover:border-blue-600 transition-all select-none group shadow-sm">
              <input 
                type="checkbox" 
                name="has_apa" 
                defaultChecked={initialData?.has_apa}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 transition-all" 
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Apă curentă</span>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-white hover:border-blue-600 transition-all select-none group shadow-sm">
              <input 
                type="checkbox" 
                name="has_gaz" 
                defaultChecked={initialData?.has_gaz}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 transition-all" 
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Gaz natural</span>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-white hover:border-blue-600 transition-all select-none group shadow-sm">
              <input 
                type="checkbox" 
                name="has_canalizare" 
                defaultChecked={initialData?.has_canalizare}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 transition-all" 
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Canalizare</span>
            </label>
          </div>
        </div>

        {/* Imagini Existente */}
        {existingImages.length > 0 && (
          <div className="col-span-full space-y-3">
             <label className="text-sm font-medium text-gray-700">Imagini Actuale</label>
             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={url} alt={`Hectar ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Imagini Noi (Preview state) */}
        {previews.length > 0 && (
          <div className="col-span-full space-y-3">
             <label className="text-sm font-medium text-gray-700">Imagini Selectate (Preview)</label>
             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {previews.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group ring-2 ring-blue-500/20">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeSelectedImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Imagini Noi Input */}
        <div className="col-span-full space-y-2">
          <label className="text-sm font-medium text-gray-700">Încarcă Imagini Noi (Multiple, max 50MB)</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click pentru a selecta imagini</p>
              </div>
              <input 
                ref={fileInputRef}
                onChange={handleImageChange}
                name="imagini" 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex flex-col items-end gap-3">
         {errorMessage && (
           <div className="text-sm font-medium text-red-600 w-full mb-2 bg-red-50 p-3 rounded-xl border border-red-100">
             {errorMessage}
           </div>
         )}
         {successMessage && (
           <div className="text-sm font-medium text-emerald-600 w-full mb-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
             {successMessage}
           </div>
         )}
         <div className="flex items-center gap-3">
          <button 
            disabled={isPending} 
            type="submit" 
            className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Se optimizează și se salvează...' : (initialData ? 'Actualizează Hectar' : 'Salvează Hectar')}
          </button>
         </div>
      </div>

    </form>
  )
}
