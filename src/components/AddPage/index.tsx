export default function AddPage() {
  return (
    <div className='flex items-center'>
      <button
        onClick={handleOnClick}
        className=' border rounded-full w-4 h-4 leading-0'
      >
        +
      </button>
    </div>
  );

  function handleOnClick() {
    console.log('Add Page click');
  }
}
