export interface DefaultPackageArchives {
  readonly engine: string;
  readonly shadcn: string;
}
export interface MaterialPackageArchives extends DefaultPackageArchives {
  readonly mui: string;
}
