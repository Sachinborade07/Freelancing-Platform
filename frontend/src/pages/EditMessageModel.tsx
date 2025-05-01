import { useState, useEffect } from 'react';
import { Message } from '../types/message';

interface EditMessageModalProps {
    message: Message;
    onUpdate: (content: string) => void;
    onClose: () => void;
}

const EditMessageModal = ({ message, onUpdate, onClose }: EditMessageModalProps) => {
    const [content, setContent] = useState(message.content);

    useEffect(() => {
        setContent(message.content);
    }, [message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(content);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h3>Edit Message</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit">Update</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default EditMessageModal;