import { useState, useEffect } from 'react';

interface VaultFormProps {
  item?: any;
  onSave: (itemData: any) => void;
  onCancel: () => void;
  initialPassword?: string;
}

export default function VaultForm({ item, onSave, onCancel, initialPassword }: VaultFormProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [username, setUsername] = useState(item?.username || '');
  const [password, setPassword] = useState(initialPassword || item?.password || '');
  const [url, setUrl] = useState(item?.url || '');
  const [notes, setNotes] = useState(item?.notes || '');
  const [tags, setTags] = useState<string[]>(item?.tags || []);
  const [folder, setFolder] = useState(item?.folder || '');

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, username, password, url, notes, tags, folder });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
        <input
          id="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">URL</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label htmlFor="folder" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Folder</label>
        <input
          id="folder"
          type="text"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            id="tagInput"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
