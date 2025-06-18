import PageBar from './components/PageBar';
import PageBarItem from './components/PageBarItem';

function App() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <PageBar>
        <PageBarItem>item 1</PageBarItem>
        <PageBarItem>item 2</PageBarItem>
        <PageBarItem>item 3</PageBarItem>
      </PageBar>
    </div>
  );
}

export default App;
