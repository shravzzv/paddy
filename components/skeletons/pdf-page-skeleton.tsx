import { Spinner } from '../ui/spinner'

export default function PdfPageSkeleton() {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Spinner />
      <p className='text-muted-foreground text-sm'>Preparing page...</p>
    </div>
  )
}
