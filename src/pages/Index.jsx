import { useState, useEffect } from "react";
import { Container, VStack, Box, SimpleGrid } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const generateInitialGrid = (size, colors) => {
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      row.push({ id: `${i}-${j}`, color });
    }
    grid.push(row);
  }
  return grid;
};

const Index = () => {
  const size = 8;
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  const [grid, setGrid] = useState(generateInitialGrid(size, colors));

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const sourceRow = Math.floor(sourceIndex / size);
    const sourceCol = sourceIndex % size;
    const destRow = Math.floor(destinationIndex / size);
    const destCol = destinationIndex % size;

    const newGrid = [...grid];
    const temp = newGrid[sourceRow][sourceCol].color;
    newGrid[sourceRow][sourceCol].color = newGrid[destRow][destCol].color;
    newGrid[destRow][destCol].color = temp;

    setGrid(newGrid);
    checkAndRemoveMatches(newGrid);
  };

  const checkAndRemoveMatches = (grid) => {
    const newGrid = [...grid];
    const toRemove = new Set();

    // Check horizontal matches
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 2; j++) {
        if (newGrid[i][j].color === newGrid[i][j + 1].color && newGrid[i][j].color === newGrid[i][j + 2].color) {
          toRemove.add(`${i}-${j}`);
          toRemove.add(`${i}-${j + 1}`);
          toRemove.add(`${i}-${j + 2}`);
        }
      }
    }

    // Check vertical matches
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size - 2; i++) {
        if (newGrid[i][j].color === newGrid[i + 1][j].color && newGrid[i][j].color === newGrid[i + 2][j].color) {
          toRemove.add(`${i}-${j}`);
          toRemove.add(`${i + 1}-${j}`);
          toRemove.add(`${i + 2}-${j}`);
        }
      }
    }

    toRemove.forEach((id) => {
      const [row, col] = id.split("-").map(Number);
      newGrid[row][col].color = null;
    });

    setGrid(newGrid);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        for (let i = size - 1; i >= 0; i--) {
          for (let j = 0; j < size; j++) {
            if (newGrid[i][j].color === null) {
              for (let k = i; k > 0; k--) {
                newGrid[k][j].color = newGrid[k - 1][j].color;
              }
              newGrid[0][j].color = colors[Math.floor(Math.random() * colors.length)];
            }
          }
        }
        return newGrid;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [colors, size]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="grid" direction="horizontal">
            {(provided) => (
              <SimpleGrid columns={size} spacing={1} {...provided.droppableProps} ref={provided.innerRef}>
                {grid.flat().map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided) => (
                      <Box
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        width="40px"
                        height="40px"
                        bg={block.color || "transparent"}
                        border={block.color ? "none" : "1px dashed gray"}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </SimpleGrid>
            )}
          </Droppable>
        </DragDropContext>
      </VStack>
    </Container>
  );
};

export default Index;