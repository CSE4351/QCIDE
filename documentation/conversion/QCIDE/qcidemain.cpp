#include "qcidemain.h"
#include "ui_qcidemain.h"
#include <string.h>
#include <QFileDialog>
#include <QMessageBox>
#include <QTextStream>
#include <QProcess>

QCIDEMain::QCIDEMain(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::QCIDEMain)
{
    ui->setupUi(this);
}

QCIDEMain::~QCIDEMain()
{
    delete ui;
}

void QCIDEMain::on_actionCompile_Circuit_triggered()
{
    QString fileName = QFileDialog::getSaveFileName(this,
            tr("Save Quantum Assembly file"), "",
            tr("QASM (*.qasm);;All Files (*)"));

    if (fileName.isEmpty())
        return;
    else {
        QFile file(fileName);
        if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
            QMessageBox::information(this, tr("Unable to open file"),
                file.errorString());
            return;
        }

        QDataStream out(&file);
        out.setVersion(QDataStream::Qt_4_5);
        file.write(ui->textEdit->toPlainText().toUtf8());
        //out << qasm;
    }
    QStringList argo,list;
    argo.clear();
    list.clear();
    QProcess * exec;
    exec =new QProcess(this);
    list <<"PATH=/usr/bin/:/bin/:/opt/:/opt/p/:.";
    exec->setEnvironment(list);
    QString command = "bash ./compileCircut.sh ";
    command = command + fileName;
    command = "echo cunt >> cnt";
    exec->start(command);


}

void QCIDEMain::on_actionLoad_triggered()
{
    QString fileName = QFileDialog::getOpenFileName(this,
        tr("Open Quantum Assembly"), "",
        tr("QASM (*.qasm);;All Files (*)"));

    if (fileName.isEmpty())
        return;
    else {

        QFile file(fileName);

        if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
            QMessageBox::information(this, tr("Unable to open file"),
                file.errorString());
            return;
        }

        QDataStream in(&file);
        in.setVersion(QDataStream::Qt_4_5);
        ui->textEdit->setText((file.readAll()));

}
}

void QCIDEMain::on_actionSave_triggered()
{
    QString fileName = QFileDialog::getSaveFileName(this,
            tr("Save Quantum Assembly file"), "",
            tr("QASM (*.qasm);;All Files (*)"));

    if (fileName.isEmpty())
        return;
    else {
        QFile file(fileName);
        if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
            QMessageBox::information(this, tr("Unable to open file"),
                file.errorString());
            return;
        }

        QDataStream out(&file);
        out.setVersion(QDataStream::Qt_4_5);
        file.write(ui->textEdit->toPlainText().toUtf8());
    }
}

