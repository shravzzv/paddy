'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pageNumber, setPageNumber] = useState(1)

  const goToNextPage = () => {
    setPageNumber((prev) => prev + 1)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => {
      if (prev === 1) return prev
      return prev - 1
    })
  }

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

      const page = await pdf.getPage(pageNumber)
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
  }, [file, pageNumber])

  return (
    <div className='mx-auto w-full max-w-xl space-y-8 py-6'>
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
        <>
          <div className='flex items-center justify-center gap-2'>
            <Button onClick={goToNextPage}>
              <ChevronRight />
              Next page
            </Button>

            <Button onClick={goToPrevPage} disabled={pageNumber === 1}>
              <ChevronLeft />
              Previous page
            </Button>
          </div>

          <canvas
            ref={canvasRef}
            width={576}
            height={790}
            className='my-4 overflow-auto rounded-xl border shadow-lg'
          ></canvas>
        </>
      )}
    </div>
  )
}
