'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, CircleAlert, X } from 'lucide-react'
import { type RenderTask } from 'pdfjs-dist'
import { useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import PdfPageSkeleton from '@/components/skeletons/pdf-page-skeleton'

const MAX_PAGE_WIDTH = 900

export default function Page() {
  const [isError, setIsError] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

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
      setIsLoading(true)
      setIsError(false)

      try {
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
      } catch (error) {
        if (
          error instanceof Error &&
          error?.name !== 'RenderingCancelledException'
        ) {
          setIsError(true)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadPdf()

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [file, pageNumber])

  return (
    <main className='flex h-dvh flex-col'>
      <header className='flex shrink-0 items-center justify-between border-b px-6 py-4'>
        <h1 className='text-lg font-semibold'>Paddy</h1>

        {file && (
          <Button
            size='icon'
            variant='ghost'
            onClick={() => setFile(null)}
            aria-label='Close document'
          >
            <X />
          </Button>
        )}
      </header>

      {file ? (
        <>
          <section
            ref={readerRef}
            className='relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6'
          >
            <canvas
              ref={canvasRef}
              className='max-h-full max-w-full rounded-xl shadow-xl'
            />

            {isLoading && (
              <div className='bg-background absolute inset-0 flex items-center justify-center'>
                <PdfPageSkeleton />
              </div>
            )}

            {isError && (
              <div className='bg-background absolute inset-0 flex items-center justify-center p-6'>
                <Alert variant='destructive' className='max-w-md'>
                  <CircleAlert />
                  <AlertTitle>Couldn&apos;t open this PDF</AlertTitle>
                  <AlertDescription>Please try another file.</AlertDescription>
                </Alert>
              </div>
            )}
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
        <section className='flex flex-1 items-center justify-center px-6'>
          <div className='flex max-w-md flex-col items-center text-center'>
            <h2 className='text-3xl font-semibold tracking-tight'>
              Read beautifully.
            </h2>

            <p className='text-muted-foreground mt-3 max-w-sm'>
              Open a PDF and settle into a comfortable reading experience.
            </p>

            <Field className='mt-8 w-auto'>
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
                className='sr-only'
              />

              <Button asChild className='cursor-pointer'>
                <label htmlFor='pdf'>Open a PDF</label>
              </Button>

              <FieldDescription className='sr-only'>
                Select a PDF file to read.
              </FieldDescription>
            </Field>
          </div>
        </section>
      )}
    </main>
  )
}
