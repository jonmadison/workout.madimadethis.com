function Header({ title, subtitle }) {
  return (
    <div id="header" className="px-4 py-2 flex-shrink-0">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
        <h2 className="text-xl text-center" style={{ fontWeight: 200 }}>{subtitle}</h2>
      </div>
    </div>
  )
}

export default Header
