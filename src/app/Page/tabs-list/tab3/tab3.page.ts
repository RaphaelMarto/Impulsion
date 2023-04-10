import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  public isIOS: boolean;

  constructor(
    private platform: Platform,
    private fileChooser: FileChooser,
    private file: File
  ) {
    this.isIOS = this.platform.is('ios');
  }

  // async selectAudioFiles() {
  //   const selectedFiles = await FileSelector.fileSelector({
  //     multipleSelection: true,
  //     exts: ['mp3', 'wav', 'ogg'],
  //   });
  //   // do something with the selected files
  // }

  // async openFileFolder() {
  //   const path = 'My Audio Files';
  //   const directory = Directory.External;
  //   const uri = await Filesystem.getUri({
  //     directory,
  //     path,
  //   });
  //   try {
  //     await Filesystem.mkdir({
  //       directory,
  //       path,
  //       recursive: false,
  //     });
  //   } catch (e) {
  //     console.error('Directory exists', e);
  //   }
  //   await this.selectAudioFiles();
  // }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file.name);
    console.log(file.type);
    console.log(file.size);
    // you can also upload the selected file to a server or play it in your app
  }

  // async selectAudioFile() {
  //   const options: FileSelectorOptions = {
  //     multiple: false,
  //     mimeType: ['audio/mpeg', 'audio/wav'],
  //   };

  //   const result = await FileSelector.fileSelector(options);

  //   if (result.files.length > 0) {
  //     const fileUri = result.files[0].uri;
  //     const fileContent = await Filesystem.readFile({
  //       path: fileUri,
  //       directory: Directory.Cache,
  //       encoding: Encoding.UTF8,
  //     });

  //     console.log('Selected audio file content:', fileContent);
  //   } else {
  //     console.log('No file selected.');
  //   }
  // }

  async chooseFile() {
    try {
      const uri = await this.fileChooser.open();
      const fileEntry = await this.file.resolveLocalFilesystemUrl(uri);
      const file = await this.getFile(fileEntry);
      console.log(file);
    } catch (error) {
      console.error(error);
    }
  }

  async getFile(fileEntry:any) {
    return new Promise((resolve, reject) => {
      fileEntry.file(resolve, reject);
    });
  }
}
