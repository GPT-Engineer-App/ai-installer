import React, { useState } from "react";
import { Container, VStack, Input, Button, Text, Code, Box, Spinner, useToast } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Index = () => {
  const [gitLink, setGitLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const toast = useToast();

  const handleFetchReadme = async () => {
    setLoading(true);
    setOutput("");

    try {
      const response = await fetch("http://localhost:3000/api/fetch-readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gitLink }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch README");
      }

      const data = await response.json();
      setOutput(data.commands.join("\n"));
      toast({
        title: "Success",
        description: "Commands generated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">GitHub Installer</Text>
        <Input placeholder="Paste GitHub link here" value={gitLink} onChange={(e) => setGitLink(e.target.value)} />
        <Button leftIcon={<FaGithub />} colorScheme="teal" onClick={handleFetchReadme} isLoading={loading}>
          Fetch README and Install
        </Button>
        {loading && <Spinner />}
        {output && (
          <Box width="100%" padding={4} borderWidth={1} borderRadius="md" overflow="auto">
            <Text fontSize="lg" marginBottom={2}>
              Generated Shell Commands:
            </Text>
            <Code whiteSpace="pre-wrap">{output}</Code>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
