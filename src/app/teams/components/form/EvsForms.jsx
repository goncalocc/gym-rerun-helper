const EvsForm = ({
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
        type="number"
        value={value}
        className={`rounded border ${hasError(`${nameId}`, pokeIndex) ? 'border-2 border-red-600' : 'border-gray-300'} p-2 text-center text-black
        [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        style={{ width: '60px', height: '35px' }}
        name={nameId}
        onChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        id={nameId}
      />
      <p></p>
    </div>
  );
};

export default EvsForm;
