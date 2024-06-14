import { useState } from "react";
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
    const temp = newGrid[sourceRow][sourceCol];
    newGrid[sourceRow][sourceCol] = newGrid[destRow][destCol];
    newGrid[destRow][destCol] = temp;

    setGrid(newGrid);
  };

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
                        bg={block.color}
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