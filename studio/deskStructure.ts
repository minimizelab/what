import { IoMdSettings } from 'react-icons/io';
import { StructureBuilder } from 'sanity/structure';

const hiddenTypes = ['settings', 'media.tag', 'media.folder', 'studio'];

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Innehåll')
    .items([
      S.listItem().singleton('settings').title('Inställningar').icon(IoMdSettings),
      S.listItem().singleton('studio').title('Studio'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenTypes.includes(listItem.getId() ?? '')
      ),
    ]);

export default deskStructure;
