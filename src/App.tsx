import PageBar from './components/PageBar';
import PageBarItem from './components/PageBarItem';

function App() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <PageBar>
        <PageBarItem>Info</PageBarItem>
        <PageBarItem>Details</PageBarItem>
        <PageBarItem>Other</PageBarItem>
        <PageBarItem>Ending</PageBarItem>
      </PageBar>
    </div>
  );
}

export default App;
