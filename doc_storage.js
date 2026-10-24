/**
 * SOMBRA_RESORT - Gestionnaire de Stockage Documentaire (IndexedDB)
 */

const DocStorage = (function() {
    const DB_NAME = 'SombraResortDocsDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'documents_blob_store';

    let dbPromise = null;

    function openDB() {
        if (!dbPromise) {
            dbPromise = new Promise((resolve) => {
                if (!window.indexedDB) {
                    resolve(null);
                    return;
                }
                try {
                    const req = indexedDB.open(DB_NAME, DB_VERSION);
                    req.onupgradeneeded = function(e) {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains(STORE_NAME)) {
                            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                        }
                    };
                    req.onsuccess = function(e) {
                        resolve(e.target.result);
                    };
                    req.onerror = function() {
                        resolve(null);
                    };
                } catch (e) {
                    resolve(null);
                }
            });
        }
        return dbPromise;
    }

    async function saveFile(id, fileOrBlob, filename, mimeType) {
        try {
            const db = await openDB();
            if (db) {
                return new Promise((resolve) => {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    const store = tx.objectStore(STORE_NAME);
                    const record = {
                        id: id,
                        blob: fileOrBlob,
                        filename: filename || fileOrBlob.name || 'document.pdf',
                        type: mimeType || fileOrBlob.type || 'application/pdf',
                        size: fileOrBlob.size || 0,
                        updated_at: new Date().toISOString()
                    };
                    const req = store.put(record);
                    req.onsuccess = () => resolve(true);
                    req.onerror = () => resolve(false);
                });
            }
        } catch (e) {
            console.error('Erreur sauvegarde doc:', e);
        }
        return false;
    }

    async function getFile(id) {
        try {
            const db = await openDB();
            if (db) {
                return new Promise((resolve) => {
                    const tx = db.transaction(STORE_NAME, 'readonly');
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.get(id);
                    req.onsuccess = () => resolve(req.result ? req.result.blob : null);
                    req.onerror = () => resolve(null);
                });
            }
        } catch (e) {
            console.error('Erreur chargement doc:', e);
        }
        return null;
    }

    async function deleteFile(id) {
        try {
            const db = await openDB();
            if (db) {
                return new Promise((resolve) => {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.delete(id);
                    req.onsuccess = () => resolve(true);
                    req.onerror = () => resolve(false);
                });
            }
        } catch (e) {
            console.error('Erreur suppression doc:', e);
        }
        return false;
    }

    return {
        saveFile,
        getFile,
        deleteFile
    };
})();
