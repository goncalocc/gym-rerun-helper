interface IvsFormProps {
  title: string;
  value: string;
  nameId: string;
  pokeIndex: number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  hasError: (field: string, index: number) => boolean;
}

const IvsForm: React.FC<IvsFormProps> = ({
  title,
  value,
  nameId,
  pokeIndex,
  handleChange,
  handleBlur,
  hasError,
}) => {
  return (
    <div>
      <p>
        <label htmlFor={nameId}>{title}</label>
      </p>
      <input
        type="text"
        value={value}
        className={`rounded border ${hasError(`${nameId}`, pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-black`}
        style={{ width: '120px', height: '35px' }}
        name={nameId}
        onChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        id={nameId}
      />
    </div>
  );
};

export default IvsForm;
