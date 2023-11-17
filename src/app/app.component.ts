import { Component } from "@angular/core";
import * as moment from "moment";
import readXlsxFile from "read-excel-file";
import { hashPassword, zeroPad } from "./utils";
import writeXlsxFile, { SheetData } from "write-excel-file";

interface Lottery {
  type: string;
  ki: string;
  code: string;
  createDate: Date;
  index: string;
  lastString: string;
}
@Component({
  selector: "my-app",
  template: `
    <div style="margin: 20px;">
    <div>v1.0.0</div>
      <input
        type="file"
        accept=".xlsx,.csv"
        class="file-upload"
        (change)="onFileDrop($event.target.files[0])"
      />
    </div>
  `,
})
export class AppComponent {
  searchTxt: string = "";
  listData: {
    A: string;
    B: string;
    C: string;
  }[] = [];
  cacheListData: {
    A: string;
    B: string;
    C: string;
  }[] = [];
  setIdA: Map<string, { A: string; B: string; C: string }> = new Map<
    string,
    { A: string; B: string; C: string }
  >();
  setIdB: Map<string, { A: string; B: string; C: string }> = new Map<
    string,
    { A: string; B: string; C: string }
  >();
  constructor() {}
  getDataRecordsArrayFromCSVFile(csvRecordsArray: string[]) {
    let csvArr = [];

    for (let i = 0; i < csvRecordsArray.length - 1; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(",");
      let csvRecord: any[] = [];
      csvRecord[0] = currentRecord[0].trim();
      csvRecord[1] = currentRecord[1].trim();
      csvRecord[2] = currentRecord[2].trim();
      csvRecord[3] = currentRecord[3].trim();
      csvArr.push(csvRecord);
    }
    return csvArr;
  }
  async convertData(data: any[], fileName: string) {
    let rawData = data;
    let newData = [];
    newData = rawData.map((e) => {
      let code = e[1].toString();

      var dateString = e[2].toString().split("/");
      if (dateString[0].length === 1) {
        dateString[0] = zeroPad(0, 1) + dateString[0];
      }
      if (dateString[1].length === 1) {
        dateString[1] = zeroPad(0, 1) + dateString[1];
      }
      let next =
        e[0].toString() +
        code +
        dateString[0] +
        dateString[1] +
        dateString[2] +
        zeroPad(e[3], 6);
      return [
        e[0],
        e[1],
        `${dateString[0]}/${dateString[1]}/${dateString[2]}`,
        zeroPad(e[3], 6),
        `https://kqxoso.online/binhphuoc/${next}`,
        hashPassword(next, 5)
      ];
    });

    this.exportToCsv(`${fileName.split('.')[0]}.csv`,newData);
    // await writeXlsxFile(newData, {
    //   fileName: `${fileName.split('.')[0]}.xlsx`,
    // });
  }
  async onFileDrop(file: File) {
    let rawData: any[] = [];
    if (file.type === "text/csv") {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        rawData = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
        console.log(rawData);
      };
      reader.onloadend = async () => {
        await this.convertData(rawData, file.name);
      };
    } else {
      rawData = await readXlsxFile(file);
      await this.convertData(rawData, file.name);
    }
  }
  exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ",";
    const keys = Object.keys(rows[0]);
    let csvContent =
      // keys.join(separator) +
      // "\n" +
      rows
        .map((row) => {
          return keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? "" : row[k];
              cell =
                cell instanceof Date
                  ? cell.toLocaleString()
                  : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join("\r\n");
        csvContent = csvContent.concat("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
