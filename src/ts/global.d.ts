declare module '*.sass' {
  const classes: { [key: string]: string };
  // eslint-disable-next-line import/no-default-export
  export default classes;
}

declare module "*.svg" {
  const content: any;
  export default content;
}