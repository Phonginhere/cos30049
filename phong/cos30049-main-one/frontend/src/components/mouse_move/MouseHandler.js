import {useEffect, useState} from 'react';

const MouseHandler = () => {
  const [coords, setCoords] = useState({x: 0, y: 0});

  useEffect(() => {
    const handleWindowMouseMove = event => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleWindowMouseMove,
      );
    };
  }, []);

//   return (
//     <div>
//       <p>
//         Mouse positioned at:{' '}
//         <b>
//           ({coords.x}, {coords.y})
//         </b>
//       </p>
//     </div>
//   );
  return (coords.x, coords.y);
}

export default MouseHandler;
