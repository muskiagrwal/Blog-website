import { FaRegFileArchive } from "react-icons/fa";
const NotFound = () => {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>404</h1>
        <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" style={styles.link}>
          Go Back Home
        </Link>
      </div>
    );
  };
export default NotFound;
FaRegFileArchive