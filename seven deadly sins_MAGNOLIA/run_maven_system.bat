@echo off
echo Building MAGNOLIA Neuro Targeting System with Maven...
mvn clean compile exec:java -Dexec.mainClass="main.java.com.magnolia.neuro.Main"
pause