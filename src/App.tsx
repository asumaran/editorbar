import PageBar from './components/PageBar';

const pages = [
  {
    id: 1,
    label: 'Info',
  },
  {
    id: 2,
    label: 'Details',
  },
  {
    id: 3,
    label: 'Ending',
  },
];

function App() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <PageBar initialPages={pages} />
    </div>
  );
}

export default App;
