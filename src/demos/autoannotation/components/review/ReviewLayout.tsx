interface ReviewLayoutProps {
  toolbar: React.ReactNode
  taskList: React.ReactNode
  canvas: React.ReactNode
  inspection: React.ReactNode
}

export function ReviewLayout({ toolbar, taskList, canvas, inspection }: ReviewLayoutProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {toolbar}
      <div className="flex flex-1 overflow-hidden">
        {taskList}
        <div className="flex-1 overflow-hidden">
          {canvas}
        </div>
        <div className="w-[380px] flex-shrink-0 overflow-hidden">
          {inspection}
        </div>
      </div>
    </div>
  )
}
