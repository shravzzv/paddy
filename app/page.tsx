'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type RenderTask } from 'pdfjs-dist'
import { useEffect, useRef, useState } from 'react'

const MAX_PAGE_WIDTH = 900

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)

  const readerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, pageCount))
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  useEffect(() => {
    if (!file) return

    let renderTask: RenderTask | undefined
    let cancelled = false

    const loadPdf = async () => {
      const pdfjs = await import('pdfjs-dist')

      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url,
      ).toString()

      const arrayBuffer = await file.arrayBuffer()
      const loadingPdf = pdfjs.getDocument({ data: arrayBuffer })
      const pdf = await loadingPdf.promise

      if (cancelled) return

      setPageCount(pdf.numPages)
      const page = await pdf.getPage(pageNumber)

      if (cancelled) return

      const reader = readerRef.current
      const canvas = canvasRef.current

      if (!reader || !canvas) return

      const naturalPageViewport = page.getViewport({ scale: 1 })
      const naturalPageWidth = naturalPageViewport.width
      const naturalPageHeight = naturalPageViewport.height

      const availableWidth = reader.clientWidth
      const availableHeight = reader.clientHeight

      const adaptiveScale = Math.min(
        availableHeight / naturalPageHeight,
        Math.min(MAX_PAGE_WIDTH, availableWidth) / naturalPageWidth,
      )
      const scaledPageViewport = page.getViewport({
        scale: adaptiveScale,
      })
      const scaledPageWidth = scaledPageViewport.width
      const scaledPageHeight = scaledPageViewport.height

      canvas.width = scaledPageWidth
      canvas.height = scaledPageHeight

      const context = canvas.getContext('2d')
      if (!context) return

      renderTask = page.render({
        canvasContext: context,
        viewport: scaledPageViewport,
        canvas,
      })

      await renderTask.promise
    }

    loadPdf().catch((error) => {
      if (error?.name !== 'RenderingCancelledException') {
        console.error(error)
      }
    })

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [file, pageNumber])

  return (
    <main className='flex h-dvh flex-col'>
      <header className='flex shrink-0 items-center justify-between gap-4 border-b px-6 py-4'>
        <h1 className='text-lg font-semibold'>Paddy</h1>

        <Field className='w-auto'>
          <FieldLabel htmlFor='pdf' className='sr-only'>
            Open PDF
          </FieldLabel>

          <Input
            id='pdf'
            type='file'
            accept='.pdf'
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null)
              setPageNumber(1)
            }}
            className='shadow'
          />

          <FieldDescription className='sr-only'>
            Select a PDF file to read.
          </FieldDescription>
        </Field>
      </header>

      {file ? (
        <>
          <section
            ref={readerRef}
            className='flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6'
          >
            <canvas
              ref={canvasRef}
              className='max-h-full max-w-full rounded-xl shadow-xl'
            />
          </section>

          <footer className='flex shrink-0 items-center justify-center gap-4 border-t px-6 py-4'>
            <Button
              size='icon'
              variant='outline'
              onClick={goToPrevPage}
              disabled={pageNumber === 1}
              aria-label='Previous page'
            >
              <ChevronLeft />
            </Button>

            <span className='min-w-16 text-center text-sm tabular-nums'>
              {pageNumber} / {pageCount}
            </span>

            <Button
              size='icon'
              variant='outline'
              onClick={goToNextPage}
              disabled={pageNumber === pageCount}
              aria-label='Next page'
            >
              <ChevronRight />
            </Button>
          </footer>
        </>
      ) : (
        <section className='flex flex-1 items-center justify-center'>
          <p className='text-muted-foreground text-sm'>
            Open a PDF to start reading.
          </p>
        </section>
      )}
    </main>
  )
}
