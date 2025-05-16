
import { Layout } from './components/Layout'

import DashBoard from './components/DashBoard'
import { ActivityProvider } from './contexts/ActivityContext'

function App() {
 

  return (
    <>
<Layout>
  <ActivityProvider>
  <DashBoard/>
  </ActivityProvider>
</Layout>
      
    </>
  )
}

export default App
