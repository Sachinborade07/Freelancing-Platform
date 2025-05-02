import { useState } from 'react';
import { Project } from '../api/project/project';
import { Message } from '../types/message';


interface ProjectMessagesProps {
    project: Project;
    currentUserId: number;
    messages: Message[];
    onSendMessage: (content: string) => Promise<void>;
    onClose: () => void;
}

const ProjectMessages = ({
    project,
    messages,
    onSendMessage,
    onClose
}: ProjectMessagesProps) => {
    const [messageContent, setMessageContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageContent.trim()) {
            onSendMessage(messageContent);
            setMessageContent('');
        }
    };


    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '600px',
                maxWidth: '90%',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '10px'
                }}>
                    <div>
                        <h2 style={{ margin: 0 }}>{project.title}</h2>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                            Project ID: {project.project_id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Close
                    </button>
                </div>

                {/* Messages list */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: '15px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    {messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666' }}>
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map(message => (
                            <div
                                key={message.message_id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: message.sender?.user_type === 'client' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    maxWidth: '80%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{
                                            fontWeight: 'bold',
                                            color: message.sender?.user_type === 'client' ? '#2c7be5' : '#6c757d',
                                        }}>
                                            {message.sender?.username || 'Unknown User'}
                                        </span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: '#999',
                                            marginLeft: '10px'
                                        }}>
                                            {new Date(message.sent_at).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div style={{
                                        padding: '10px 15px',
                                        backgroundColor: message.sender?.user_type === 'client' ? '#e3f2fd' : '#f5f5f5',
                                        borderRadius: message.sender?.user_type === 'client' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                        color: '#333',
                                        wordBreak: 'break-word',
                                        position: 'relative'
                                    }}>
                                        {message.content}

                                        {message.sender?.user_type === 'client' && (
                                            <div style={{
                                                position: 'absolute',
                                                right: -30,
                                                top: 0,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '5px'
                                            }}>

                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message input form */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        gap: '10px',
                        borderTop: '1px solid #eee',
                        paddingTop: '15px'
                    }}
                >
                    <input
                        type="text"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: '10px 15px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!messageContent.trim()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            opacity: !messageContent.trim() ? 0.6 : 1
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProjectMessages;