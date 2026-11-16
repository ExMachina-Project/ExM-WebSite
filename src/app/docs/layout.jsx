import DocsSidebar from '../../components/DocsSidebar.jsx'

export default function DocumentationLayout({ children }) {
  return <div className="docs-shell"><DocsSidebar />{children}</div>
}
