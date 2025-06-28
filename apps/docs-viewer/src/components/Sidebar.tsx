import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

type Manifest = {
  [key: string]: string | Manifest;
};

const NavItem = ({ name, item }: { name: string; item: string | Manifest; }) => {
  if (typeof item === 'string') {
    const docPath = `/docs/${item}`;
    return (
      <li>
        <NavLink 
          to={docPath} 
          className={({ isActive }) =>
            `block p-2 text-sm rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          📄 {name}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <details open className="group">
        <summary className="p-2 font-medium cursor-pointer list-none flex items-center text-gray-800 dark:text-gray-200">
          <span className="mr-2">📁</span>
          <span className="flex-1">{name}</span>
        </summary>
        <ul className="pl-6 border-l border-gray-200 dark:border-gray-700 ml-4 mt-1">
          {Object.entries(item).map(([key, value]) => (
            <NavItem key={key} name={key} item={value} />
          ))}
        </ul>
      </details>
    </li>
  );
};

const Sidebar = () => {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetch('/manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(error => console.error('Failed to load manifest:', error));
  }, []);

  return (
    <aside className={`${isCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-screen`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            <NavLink to="/" className="hover:text-blue-600">
              🌟 AI-Q Library
            </NavLink>
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>
      
      {!isCollapsed && (
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1 pb-8">
            {manifest ? (
              Object.entries(manifest).map(([key, value]) => (
                <NavItem key={key} name={key} item={value} />
              ))
            ) : (
              <p className="px-2 text-gray-500">Loading navigation...</p>
            )}
          </ul>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar; 