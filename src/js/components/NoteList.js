import m from 'mithril';
import _ from 'lodash';
import Publisher from '../lib/Publisher';
import NoteListVm from '../vms/NoteList';
import { remote } from 'electron';
import moment from 'moment';

const { Menu, MenuItem } = remote;
const makeContextMenu = (noteId) => {
    const folderListContextMenus = [
        {
            label: 'delete',
            click() {
                Publisher.trigger('deleteNote', noteId);
            },
        },
    ];
    const folderListContextMenu = new Menu();
    _.forEach(folderListContextMenus, (menu) => {
        folderListContextMenu.append(new MenuItem(menu));
    });
    return folderListContextMenu;
};

export default {

    controller() {
        this.onClickNote = (noteId) => {
            Publisher.trigger('showNote', noteId);
        };
        this.showContextMenu = (noteId) => {
            Publisher.on('deleteNote', this.deleteNote, this);
            makeContextMenu(noteId).popup(remote.getCurrentWindow());
        };
        this.deleteNote = (noteId) => {
            m.redraw.strategy('diff');
            m.startComputation();
            NoteListVm.deleteNote({ id: noteId });
            m.endComputation();
        };

        Publisher.on('onClickFolderName', NoteListVm.updateDisplayNoteModelsCond, null);
    },

    view(ctrl) {
        return <div id= 'note-list-container' class='column is-3'>
          <div id='note-list-header'>
            <button id="note-create-btn" onclick={ NoteListVm.createNewNote }>
                <span class="icon is-medium"><i class="fa fa-plus-circle" aria-hidden="true"></i></span>
            </button>
          </div>
          <ul id='note-list'>
            {
              NoteListVm.getDisplayNoteModels().map((model) => {
                return <li class="note-list-note" note-id={ model.id() } onclick={ m.withAttr('note-id', ctrl.onClickNote) } oncontextmenu={ m.withAttr('note-id', ctrl.showContextMenu) }>
                  <p class="note-list-note-title">{ model.title() }</p>
                  <p class="note-list-note-updated-at">updated: { moment.unix(model.updatedAt()).format('YYYY/MM/DD HH:mm') }</p>
                </li>
              })
            }
          </ul>

        </div>
    },
};
