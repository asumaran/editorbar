import PageBar from './components/PageBar';
import PageBarItem from './components/PageBarItem';
import PageSettingsMenu from './components/PageSettingsMenu';

function App() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <PageBar>
        <PageBarItem>Info</PageBarItem>
        <PageBarItem>Details</PageBarItem>
        <PageBarItem>Other</PageBarItem>
        <PageBarItem>Ending</PageBarItem>
      </PageBar>
      <PageSettingsMenu></PageSettingsMenu>
    </div>
  );
}

export default App;
