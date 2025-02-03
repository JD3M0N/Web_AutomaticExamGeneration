export const fetchQuestions = async (professorId: number, setQuestions: Function, setNotification: Function) => {
    try {
      const response = await fetch('http://localhost:5024/api/Question', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Extrae la lista de preguntas desde $values
      const questionsArray = data.$values || [];
      console.log("Preguntas obtenidas:", questionsArray);
  
      // Enriquecer cada pregunta obteniendo la información del profesor
      const enrichedQuestions = await Promise.all(
        questionsArray.map(async (question: any) => {
          try {
            const profResponse = await fetch(`http://localhost:5024/api/Professor/${question.professorId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (profResponse.ok) {
              const professorData = await profResponse.json();
              // Se asigna la información del profesor (incluyendo su email) a la pregunta
              question.professor = professorData;
            }
          } catch (error) {
            console.error('Error al obtener profesor:', error);
          }
          return question;
        })
      );
  
      setQuestions(enrichedQuestions);
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
      setNotification({ message: 'Error al obtener las preguntas.', type: 'error' });
    }
  };