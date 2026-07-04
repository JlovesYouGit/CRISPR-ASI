@echo off
echo Compiling MAGNOLIA Neuro Targeting System...
javac -source 1.8 -target 1.8 -d target/classes src/main/java/com/magnolia/neuro/*.java

if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
    echo Running system...
    java -cp target/classes main.java.com.magnolia.neuro.Main
) else (
    echo Compilation failed. Please check Java installation and PATH.
)
pause