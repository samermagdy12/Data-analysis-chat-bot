import ast


class CodeValidator:
    """
    Validates AI-generated Python code before execution.
    """

    FORBIDDEN_IMPORTS = {
        "os",
        "sys",
        "subprocess",
        "socket",
        "shutil",
        "requests",
        "pathlib",
        "pickle",
        "builtins",
    }

    FORBIDDEN_FUNCTIONS = {
        "eval",
        "exec",
        "compile",
        "open",
        "__import__",
        "globals",
        "locals",
        "input",
    }

    FORBIDDEN_ATTRIBUTES = {
        "__dict__",
        "__class__",
        "__bases__",
        "__subclasses__",
        "__globals__",
        "__code__",
    }

    def validate(self, code: str):

        try:
            tree = ast.parse(code)

        except SyntaxError as e:
            raise ValueError(
                f"Syntax Error: {e}"
            )

        self._check_imports(tree)
        self._check_function_calls(tree)
        self._check_attributes(tree)

        return True

    # ------------------------------------
    # Check Imports
    # ------------------------------------

    def _check_imports(
        self,
        tree: ast.AST
    ):

        for node in ast.walk(tree):

            if isinstance(node, ast.Import):

                for alias in node.names:

                    module = alias.name.split(".")[0]

                    if module in self.FORBIDDEN_IMPORTS:

                        raise ValueError(
                            f"Forbidden import: {module}"
                        )

            elif isinstance(node, ast.ImportFrom):

                if node.module:

                    module = node.module.split(".")[0]

                    if module in self.FORBIDDEN_IMPORTS:

                        raise ValueError(
                            f"Forbidden import: {module}"
                        )

    # ------------------------------------
    # Check Function Calls
    # ------------------------------------

    def _check_function_calls(
        self,
        tree: ast.AST
    ):

        for node in ast.walk(tree):

            if isinstance(node, ast.Call):

                if isinstance(node.func, ast.Name):

                    function_name = node.func.id

                    if function_name in self.FORBIDDEN_FUNCTIONS:

                        raise ValueError(
                            f"Forbidden function: {function_name}"
                        )

    # ------------------------------------
    # Check Dangerous Attributes
    # ------------------------------------

    def _check_attributes(
        self,
        tree: ast.AST
    ):

        for node in ast.walk(tree):

            if isinstance(node, ast.Attribute):

                if node.attr in self.FORBIDDEN_ATTRIBUTES:

                    raise ValueError(
                        f"Forbidden attribute: {node.attr}"
                    )


validator = CodeValidator()