import DocsSidebar from '../../components/DocsSidebar'

export default function DocumentationLayout({ children }: LayoutProps<'/docs'>) {
  return <div className="docs-shell"><DocsSidebar />{children}</div>
}
