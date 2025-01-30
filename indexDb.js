window.indexedDbHelper = {
    openDatabase: function () {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open("QuizResultsDB", 1);

            request.onupgradeneeded = function (event) {
                let db = event.target.result;
                if (!db.objectStoreNames.contains("results")) {
                    db.createObjectStore("results", { keyPath: "id" });
                }
            };

            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    },

    saveResult: async function (result) {
        let db = await this.openDatabase();
        let transaction = db.transaction(["results"], "readwrite");
        let store = transaction.objectStore("results");
        store.add(result);
    },

    getResults: function () {
        return new Promise(async (resolve, reject) => {
            let db = await this.openDatabase();
            let transaction = db.transaction(["results"], "readonly");
            let store = transaction.objectStore("results");
            let request = store.getAll();

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }
};
