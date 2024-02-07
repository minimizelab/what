import { IoMdSettings } from 'react-icons/io';
import { StructureBuilder } from 'sanity/structure';

const hiddenTypes = ['settings', 'media.tag', 'studio'];

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Innehåll')
    .items(S.documentTypeListItems())
    .items([
      S.listItem()
        .title('Inställningar')
        .icon(IoMdSettings)
        .child(S.editor().schemaType('settings').documentId('settings')),
      S.listItem()
        .title('Studio')
        .child(S.editor().schemaType('studio').documentId('studio')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenTypes.includes(listItem.getId() ?? '')
      ),
    ]);

export default deskStructure;
