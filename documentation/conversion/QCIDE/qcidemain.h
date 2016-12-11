#ifndef QCIDEMAIN_H
#define QCIDEMAIN_H

#include <QMainWindow>

namespace Ui {
class QCIDEMain;
}

class QCIDEMain : public QMainWindow
{
    Q_OBJECT

public:
    explicit QCIDEMain(QWidget *parent = 0);
    ~QCIDEMain();

private slots:
    void on_actionCompile_Circuit_triggered();

    void on_actionLoad_triggered();

    void on_actionSave_triggered();


private:
    Ui::QCIDEMain *ui;
};

#endif // QCIDEMAIN_H
