
import { useContext } from 'react'
import './Home.css'
import { AuthContext } from '../AuthContext'
import { ListGroup } from 'react-bootstrap';
import { useNotes } from '../lib/getNotes';
import { BsPencilSquare } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import { NoteArrayType } from '../../../core/src/ValibotNoteSchema';


function Lander() {
    return <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
    </div>
}


interface NoteListProps {
    notes: NoteArrayType
}

function NoteList(props: NoteListProps) {

    return (
        <>
            <LinkContainer to="/notes/new">
                <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                    <BsPencilSquare size={17} />
                    <span className="ms-2 fw-bold">Create a new note</span>
                </ListGroup.Item>
            </LinkContainer>
            {props.notes.map(({ noteId, content, createdAt }) => (
                <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                    <ListGroup.Item action className="text-nowrap text-truncate">
                        <span className="fw-bold">{content.trim().split("\n")[0]}</span>
                        <br />
                        <span className="text-muted">
                            Created: {new Date(createdAt).toLocaleDateString()}
                        </span>
                    </ListGroup.Item>
                </LinkContainer>
            ))}
        </>
    )

}

function Notes() {

    const { data, isLoading } = useNotes();

    return <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{
            isLoading ? <div>Loading The notes</div> :
                <NoteList notes={data ?? []} />}
        </ListGroup>
    </div >
}

export function Home() {

    const authContext = useContext(AuthContext);

    return (
        <div className="home">
            {
                authContext.isAuthenticated ? <Notes /> : <Lander />
            }
        </div>
    )
}