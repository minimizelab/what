import S from '@sanity/desk-tool/structure-builder';
import { IoMdSettings } from 'react-icons/io';

export default () =>
  S.list()
    .title('Innehåll')
    .items(S.documentTypeListItems())
    .items([
      S.listItem()
        .title('Inställningar')
        .icon(IoMdSettings)
        .child(S.editor().schemaType('settings').documentId('settings')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !['settings', 'media.tag'].includes(<string>listItem.getId())
      ),
    ]);
