const { readFile, writeFile } = require("fs/promises");

class heroRepository {
  constructor({ file }) {
    this.file = file;
  }

  async _currentFileContent() {
    return JSON.parse(await readFile(this.file));
  }

  async find(itemId) {
    const all = await this._currentFileContent();
    if (!itemId) return all;

    return all.find(({ id }) => itemId === id);
  }

  async create(data) {
    const currentFile = await this._currentFileContent();

    await writeFile(this.file, JSON.stringify(currentFile));

    return data.id;
  }
}
module.export = heroRepository;
