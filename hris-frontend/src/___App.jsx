import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HRISHome from './templates/HomeTemplate'
import AddEmployee from './templates/AddEmployeeTemplate'
import PayrollPage from './templates/PayrollTemaplte'
// import People from './templates/PeopleTemplate'
import Compensation from './templates/Compensetion'
import PayrollPageii from './templates/PayroleTemplate_ii'
import PeopleWithSalaryEdit from './templates/PeopleWithSalaryEdit'


import Header from './components/Header'
import Home from './components/home/Home'
import People from './components/people/People'


function App() {
  const [count, setCount] = useState(0)
  const [activeNav, setActiveNav] = useState("Dashboard");

  console.log(activeNav)
  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000000" }}>
      <Header
        activeNav = {activeNav}
        setActiveNav = {(e) => setActiveNav(e)}
      />
      <Home/>
      <People/>
    </div>


    // <PeopleWithSalaryEdit/>
    // <PayrollPageii/>
    // <Compensation/>
    // <PayrollPage/>
    // <HRISHome/>
    // <People/>
    // <AddEmployee/>
  )
}

export default App
