import { useState } from 'react';
import '../pagestyles/admin.css';

function AddAnnouncement({ addAnnouncement }) {
    const [newAnnouncement, setNewAnnouncement] = useState({
        Date: '',
        Title: '',
        Description: '',
        Image: '',
        Background: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addAnnouncement(newAnnouncement);
    };

    return (
        <div className='add-edit-announcement-container'>
            <h3>Add Announcement</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" value={newAnnouncement.Date} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Date: e.target.value })} />
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={newAnnouncement.Title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Title: e.target.value })} />
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={newAnnouncement.Description} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Description: e.target.value })} />
                <label htmlFor="image">Image:</label>
                <input type="file" id="image" name="image" onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Image: URL.createObjectURL(e.target.files[0]) })} />
                <label htmlFor="background">Background:</label>
                <input type="file" id="background" name="background" onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Background: URL.createObjectURL(e.target.files[0]) })} />
                <button type="submit">Add Announcement</button>
            </form>
        </div>
    );
}

export default AddAnnouncement;
