import PageBar from './components/PageBar';

/**
 * Initial page data for the application
 * In a real application, this would typically come from an API or database
 */
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

/**
 * Main App component that demonstrates the PageBar functionality
 *
 * This component serves as the root of the application and provides:
 * - Initial page data for demonstration
 * - Centered layout for the PageBar component
 * - Entry point for the page management functionality
 *
 * The App is wrapped by AppProvider in main.tsx to provide state management context.
 */
function App() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <PageBar initialPages={pages} />
    </div>
  );
}

export default App;
