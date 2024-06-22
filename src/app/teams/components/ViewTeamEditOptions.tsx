interface ViewTeamEditOptionsProps {
    handleClick: () => void;
}

const ViewTeamEditOptions: React.FC<ViewTeamEditOptionsProps> = ({handleClick: handleClickSave}) => {
    return (
        <main>
            <div className="flex justify-center mb-4 space-x-4">
                <button 
                onClick={handleClickSave}
                className="btn-edit bg-white-500 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                <button 
                onClick={handleClickSave}
                className="btn-import bg-black-500 text-white px-4 py-2 rounded hover:bg-green-700">Cancel</button>
            </div>
        </main>
    )
}

export default ViewTeamEditOptions;