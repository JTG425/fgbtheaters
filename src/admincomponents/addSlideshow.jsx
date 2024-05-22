import "../componentstyles/addslideshow.css";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { downloadData, uploadData, getUrl } from 'aws-amplify/storage';


function AddSlideShow(props) {
    const [slideshow, setSlideshow] = useState([]);

    useEffect(() => {
        const fetchSlideShow = async () => {
            let slideshowXML = '';
            try {
                const getslideshowXML = await downloadData({
                    path: 'public/slideshow/slideshow.xml',
                }).result;
                slideshowXML = await getslideshowXML.body.text();
                parseSlideshowXML(slideshowXML);
            } catch (error) {
                console.log('Error : ', error);
            }
        };

        const parseSlideshowXML = async (xml) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');
            const slideNodes = xmlDoc.getElementsByTagName('slide');

            const parsedslideshow = [];
            for (let i = 0; i < slideNodes.length; i++) {
                const slideNode = slideNodes[i];
                const id = slideNode.getElementsByTagName('id')[0].textContent;
                const image = slideNode.getElementsByTagName('image')[0].textContent;
                const title = slideNode.getElementsByTagName('title')[0].textContent;
                const description = slideNode.getElementsByTagName('description')[0].textContent;

                parsedslideshow.push({ id, image, title, description });
            }
            console.log(parsedslideshow)
            setSlideshow(parsedslideshow);
        }

        fetchSlideShow();

    }, []);

    return (
        <div className="add-slideshow-container">
            <motion.button
                className="add-slideshow-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                Add To Slideshow
            </motion.button>
            <div className="slideshow-table-container">
                <table className="slideshow-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slideshow.map((slide, index) => (
                            <tr key={index}>
                                <td>
                                    <img
                                        className="slideshow-image"
                                        src={slide.image}
                                        alt={slide.title}
                                    />
                                </td>
                                <td>{slide.title}</td>
                                <td>{slide.description}</td>
                                <td>
                                    <motion.button
                                        className="edit-button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Edit
                                    </motion.button>
                                    <motion.button
                                        className="delete-button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Delete
                                    </motion.button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddSlideShow;
