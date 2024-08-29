export class TranslationsResources {
  ApplicationCode: string = 'eInvoiceCO';
  LanguageCode: string = 'es-CO';
  ResourceSetCode: string = 'Document';
  CategoryCode: string = 'Labels';
  ResourceKey: string = '';
  Description: string = '';
}

export interface TranslationsResourcesResults {
  ApplicationCode: string;
  Key: string;
  CategoryCode: string;
  ResourceSetCode: string;
  Descriptions: TranslationsResources[];
}
