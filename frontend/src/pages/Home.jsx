import hero from '../assets/food.webp'
import Navbar from '../components/Navbar'
const Home = () => {

    return (
        <>
            <section className='flex gap-4 flex-wrap'>
                <Navbar />
                <img src={hero} alt="food on a table" className='h-screen w-full object-cover' /> 
            </section>
        </>
    )
}

export default Home
