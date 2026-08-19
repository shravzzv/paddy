'use client'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!file) return

    const loadPdf = async () => {
      const pdfjs = await import('pdfjs-dist')

      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url,
      ).toString()

      const arrayBuffer = await file.arrayBuffer()
      const loadingPdf = pdfjs.getDocument({ data: arrayBuffer })
      const pdf = await loadingPdf.promise

      const page = await pdf.getPage(1)
      const viewport = page.getViewport({ scale: 1 })

      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return

      const renderContext = {
        canvasContext: context,
        viewport,
        canvas,
      }

      await page.render(renderContext).promise
    }

    loadPdf()
  }, [file])

  return (
    <div className='mx-auto w-full max-w-xl py-6'>
      <Field>
        <FieldLabel htmlFor='pdf'>File</FieldLabel>

        <Input
          id='pdf'
          type='file'
          accept='.pdf'
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <FieldDescription>Please select a PDF file to upload.</FieldDescription>
      </Field>

      {file && (
        <canvas
          ref={canvasRef}
          width={576}
          height={790}
          className='my-8 overflow-auto rounded-xl border shadow-lg'
        ></canvas>
      )}
    </div>
  )
}
