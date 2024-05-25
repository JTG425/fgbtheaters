import { useState } from 'react';
import '../pagestyles/admin.css';

function EditAnnouncement({ announcement, index, updateAnnouncement }) {
    const [editedAnnouncement, setEditedAnnouncement] = useState(announcement);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateAnnouncement(editedAnnouncement, index);
    };

    return (
        <div className='add-edit-announcement-container'>
            <h3>Edit Announcement</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" value={editedAnnouncement.Date} onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Date: e.target.value })} />
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={editedAnnouncement.Title} onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Title: e.target.value })} />
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={editedAnnouncement.Description} onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Description: e.target.value })} />
                <label htmlFor="image">Image:</label>
                <input type="file" id="image" name="image" onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Image: URL.createObjectURL(e.target.files[0]) })} />
                <label htmlFor="background">Background:</label>
                <input type="file" id="background" name="background" onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Background: URL.createObjectURL(e.target.files[0]) })} />
                <button type="submit">Edit Announcement</button>
            </form>
        </div>
    );
}

export default EditAnnouncement;
